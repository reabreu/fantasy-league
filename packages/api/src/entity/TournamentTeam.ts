import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Tournament } from "./Tournament";

@Entity()
export class TournamentTeam {
  @PrimaryColumn()
  id: number;

  @Column()
  tournament_id: number;

  @Column()
  team_id: number;

  // @ManyToOne(type => Tournament, tournament => tournament.teams)
}
