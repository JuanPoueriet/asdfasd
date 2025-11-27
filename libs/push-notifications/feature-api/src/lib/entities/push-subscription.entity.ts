import { User } from '@univeex/users/api-data-access';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';


@Entity()
export class PushSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  endpoint: string;

  @Column()
  p256dh: string;

  @Column()
  auth: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  userId: string;
}
