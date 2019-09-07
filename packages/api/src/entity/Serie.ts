import { Entity, Column, PrimaryColumn } from "typeorm";

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

  @Column()
  year: number;
}
