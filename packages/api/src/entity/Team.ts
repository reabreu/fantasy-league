import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import { TournamentTeam } from "./TournamentTeam";

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

  @OneToMany(type => TournamentTeam, tournamentTeam => tournamentTeam.team)
  tournaments: TournamentTeam[];
}
