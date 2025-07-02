import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import { Like } from './like.entity';

@Entity('videos')
export class Video {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  videoUrl: string;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ default: 0 })
  duration: number; // in seconds

  @Column({ default: 0 })
  viewsCount: number;

  @Column({ default: 0 })
  likesCount: number;

  @Column({ default: 0 })
  commentsCount: number;

  @Column({ default: 0 })
  sharesCount: number;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @Column({ default: true })
  isPublic: boolean;

  @Column({ default: false })
  isPremium: boolean;

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any; // Video processing metadata

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @Column()
  userId: string;

  @ManyToOne(() => User, user => user.videos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Comment, comment => comment.video)
  comments: Comment[];

  @OneToMany(() => Like, like => like.video)
  likes: Like[];
} 