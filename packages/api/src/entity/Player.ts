import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Player {
  @PrimaryColumn()
  id: number;

  @Column()
  first_name: string;

  @Column({
    nullable: true
  })
  hometown: string;

  @Column()
  last_name: string;

  @Column()
  name: string;

  @Column()
  image_url: string;

  @Column()
  role: string;

  @Column()
  slug: string;
}
