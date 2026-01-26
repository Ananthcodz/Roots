import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  first_name!: string;

  @Column()
  last_name!: string;

  @Column({ nullable: true })
  full_name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  bio!: string;

  @Column({ nullable: true })
  location!: string;

  @Column({ default: false })
  is_google_signed_in!: boolean;

  @Column({ nullable: true })
  token!: string;

  @Column({ nullable: true })
  photo_url!: string;

  @Column({nullable: true})
  age!: number;

  @Column({nullable:true})
  gender!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;
}
