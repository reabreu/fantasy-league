import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { Match } from "./Match";

@Entity()
export class Game {
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

  @Column()
  finished: boolean;

  @Column()
  match_id: boolean;

  @ManyToOne(type => Match)
  @JoinColumn({ name: "match_id" })
  match: Match;

  @Column()
  status: boolean;

  @Column({
    type: "json",
    nullable: true
  })
  players: string;

  @Column({
    type: "json",
    nullable: true
  })
  teams: string;

  @Column({
    type: "json",
    nullable: true
  })
  winner: string;
}
