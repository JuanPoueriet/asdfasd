import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from './entities/user.entity/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAllByOrg(
    organizationId: string,
    options: {
      page: number;
      pageSize: number;
      searchTerm?: string;
      statusFilter?: string;
      sortColumn?: string;
      sortDirection?: 'ASC' | 'DESC';
    },
  ): Promise<{ data: User[]; total: number }> {
    const {
      page,
      pageSize,
      searchTerm,
      statusFilter,
      sortColumn,
      sortDirection,
    } = options;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder
      .where('user.organizationId = :organizationId', { organizationId })
      .leftJoinAndSelect('user.roles', 'role')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    if (searchTerm) {
      queryBuilder.andWhere(
        '(user.firstName ILIKE :searchTerm OR user.lastName ILIKE :searchTerm OR user.email ILIKE :searchTerm)',
        { searchTerm: `%${searchTerm}%` },
      );
    }

    if (statusFilter && statusFilter !== 'all') {
      queryBuilder.andWhere('user.status = :status', {
        status: statusFilter,
      });
    }

    if (sortColumn && sortDirection) {
      const allowedColumns = [
        'firstName',
        'lastName',
        'email',
        'status',
        'createdAt',
      ];
      if (allowedColumns.includes(sortColumn)) {
        queryBuilder.orderBy(`user.${sortColumn}`, sortDirection);
      }
    } else {
      queryBuilder.orderBy('user.createdAt', 'DESC');
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  async findOne(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: id as any },
    });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findOneByOrg(id: string, organizationId: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id, organizationId });
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    await this.userRepository.update(id, user);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
