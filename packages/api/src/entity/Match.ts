import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { League } from "./League";
import { Serie } from "./Serie";
import { Tournament } from "./Tournament";
import { Team } from "./Team";

@Entity()
export class Match {
  @PrimaryColumn()
  id: number;

  @Column({
    type: "timestamp",
    nullable: true
  })
  begin_at: string;

  @Column({
    type: "timestamp",
    nullable: true
  })
  end_at: string;

  @Column({
    type: "timestamp",
    nullable: true
  })
  scheduled_at: string;

  @ManyToOne(type => League)
  @JoinColumn({ name: "league_id" })
  league: number;

  @Column()
  league_id: number;

  @Column()
  name: string;

  @ManyToOne(type => Serie)
  @JoinColumn({ name: "serie_id" })
  serie: number;

  @Column()
  serie_id: number;

  @Column()
  slug: string;

  @ManyToOne(type => Tournament)
  @JoinColumn({ name: "tournament_id" })
  tournament: number;

  @Column()
  tournament_id: number;

  @ManyToOne(type => Team)
  @JoinColumn({ name: "winner_id" })
  winner: number;

  @Column()
  winner_id: number;
}
