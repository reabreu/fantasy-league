import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class League {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column()
  image_url: string;
}
