import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Team {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column()
  image_url: string;

  @Column()
  acronym: string;
}
