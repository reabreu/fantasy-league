import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  ManyToMany,
  JoinTable
} from "typeorm";
import { Tournament } from "./Tournament";
import { Team } from "./Team";
import { Player } from "./Player";

@Entity()
export class TournamentTeam {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tournament_id: number;

  @Column()
  team_id: number;

  @ManyToOne(type => Tournament, tournament => tournament.teams)
  @JoinColumn({ name: "tournament_id" })
  tournaments: Tournament;

  @ManyToOne(type => Team, team => team.tournaments, {
    eager: true
  })
  @JoinColumn({ name: "team_id" })
  team: Team[];

  @ManyToMany(type => Player, player => player.tournamentTeams, {
    eager: true
  })
  @JoinTable()
  players: Player[];
}
