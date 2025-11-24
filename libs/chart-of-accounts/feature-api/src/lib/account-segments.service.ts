import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { AccountSegmentDefinition } from './entities/account-segment-definition.entity';
import { ConfigureAccountSegmentsDto } from './dto/account-segment-definition.dto';

@Injectable()
export class AccountSegmentsService {
  constructor(
    @InjectRepository(AccountSegmentDefinition)
    private readonly segmentDefinitionRepository: Repository<AccountSegmentDefinition>,
    private readonly dataSource: DataSource,
  ) {}

  findByOrg(organizationId: string): Promise<AccountSegmentDefinition[]> {
    return this.segmentDefinitionRepository.find({
      where: { organizationId },
      order: { order: 'ASC' },
    });
  }

  async configure(dto: ConfigureAccountSegmentsDto, organizationId: string): Promise<AccountSegmentDefinition[]> {
    return this.dataSource.transaction(async manager => {
        const repo = manager.getRepository(AccountSegmentDefinition);
        
        const accountExists = await manager.query(`SELECT 1 FROM "accounts" WHERE "organization_id" = $1 LIMIT 1;`, [organizationId]);
        
        if (accountExists.length > 0) {
            throw new BadRequestException('No se puede modificar la estructura de segmentos porque ya existen cuentas en el plan contable.');
        }

        await repo.delete({ organizationId });

        const definitions = dto.segments.map((segmentDto, index) => {
            return repo.create({
                ...segmentDto,
                organizationId,
                order: index,
            });
        });

        return repo.save(definitions);
    });
  }
  
  async createDefaultSegments(organizationId: string, manager: EntityManager): Promise<void> {
    const repo = manager.getRepository(AccountSegmentDefinition);
    const defaultConfig: ConfigureAccountSegmentsDto = {
      segments: [
        { name: 'Cuenta', length: 3, isRequired: true },
        { name: 'Subcuenta', length: 2, isRequired: true },
      ],
    };

    const definitions = defaultConfig.segments.map((segmentDto, index) => {
        return repo.create({
            ...segmentDto,
            organizationId,
            order: index,
        });
    });

    await repo.save(definitions);
  }
}