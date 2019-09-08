import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import { Serie } from "./Serie";
import { Tournament } from "./Tournament";

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

  @OneToMany(type => Serie, serie => serie.league_id)
  series: Serie[];

  @OneToMany(type => Tournament, tournament => tournament.league_id)
  tournaments: Serie[];
}
