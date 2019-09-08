import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  OneToMany
} from "typeorm";
import { Serie } from "./Serie";
import { League } from "./League";
import { TournamentTeam } from "./TournamentTeam";
import { Match } from "./Match";
@Entity()
export class Tournament {
  @PrimaryColumn()
  id: number;

  @Column()
  begin_at: string;

  @Column()
  end_at: string;

  @Column()
  slug: string;

  @Column()
  name: string;

  @Column()
  league_id: number;

  @Column()
  serie_id: number;

  @ManyToOne(type => League, league => league.tournaments)
  @JoinColumn({ name: "league_id" })
  league: League;

  @ManyToOne(type => Serie, serie => serie.tournaments)
  @JoinColumn({ name: "serie_id" })
  serie: Serie;

  @OneToMany(
    type => TournamentTeam,
    tournamentTeam => tournamentTeam.tournaments
  )
  teams: TournamentTeam[];

  @OneToMany(type => Match, match => match.tournament)
  matches: Match[];
}
