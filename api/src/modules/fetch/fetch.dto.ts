import { ApiModelProperty } from '@nestjs/swagger';

import { PersonDto } from "../person/person.dto";
import { FetchClientName, FetchState } from "./fetch.enums";
import { IsEnum } from 'class-validator';

export class PersonFetchDto {

  @IsEnum(FetchClientName)
  @ApiModelProperty()
  readonly clientName: FetchClientName;

  @ApiModelProperty()
  readonly person: PersonDto;

}

export class FetchExploreDto extends PersonFetchDto {

  @ApiModelProperty()
  readonly fetchUrl: string;

}

export class FetchDto extends FetchExploreDto {

  @ApiModelProperty()
  readonly sampleUrl: string;

}

export class FetchRestDto {

  @IsEnum(FetchClientName)
  @ApiModelProperty({ enum: Object.keys(FetchClientName) })
  readonly clientName: FetchClientName;

  @ApiModelProperty()
  readonly personKey: string;

  @ApiModelProperty()
  readonly fetchUrl: string;

  @ApiModelProperty()
  readonly createDate: string;

  @IsEnum(FetchState)
  @ApiModelProperty({ enum: Object.keys(FetchState) })
  readonly state: FetchState;

  @ApiModelProperty()
  readonly selectors: Array<FetchExploreSelectors>;

  @ApiModelProperty()
  readonly selector: string;

  @ApiModelProperty()
  readonly updateDate: string;

  @ApiModelProperty()
  readonly lastResult: string[];
}

export interface FetchExploreSelectors {
  sampleUrl: string;
  selector: string;
}