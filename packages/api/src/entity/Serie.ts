import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  OneToMany
} from "typeorm";
import { League } from "./League";
import { Tournament } from "./Tournament";

@Entity()
export class Serie {
  @PrimaryColumn()
  id: number;

  @Column({
    type: "timestamp"
  })
  begin_at: string;

  @Column({
    type: "timestamp",
    nullable: true
  })
  end_at: string;

  @Column()
  full_name: string;

  @Column()
  slug: string;

  @Column()
  league_id: number;

  @ManyToOne(type => League, league => league.series)
  @JoinColumn({ name: "league_id" })
  league: number;

  @Column()
  year: number;

  @OneToMany(type => Tournament, tournament => tournament.serie_id)
  tournaments: Tournament[];
}
