import { Entity, Column, PrimaryColumn } from "typeorm";

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
}
