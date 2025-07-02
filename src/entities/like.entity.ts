import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from './user.entity';
import { Video } from './video.entity';
import { Comment } from './comment.entity';

export enum LikeType {
  VIDEO = 'video',
  COMMENT = 'comment',
}

@Entity('likes')
@Unique(['userId', 'videoId', 'commentId'])
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: LikeType,
  })
  type: LikeType;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @Column()
  userId: string;

  @Column({ nullable: true })
  videoId: string;

  @Column({ nullable: true })
  commentId: string;

  @ManyToOne(() => User, user => user.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Video, video => video.likes, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'videoId' })
  video: Video;

  @ManyToOne(() => Comment, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'commentId' })
  comment: Comment;
} 