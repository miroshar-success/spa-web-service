import { ApiModelProperty } from '@nestjs/swagger';

import { FetchState } from "./fetch.enums";
import { IsEnum } from 'class-validator';
import {ClientName} from "../clients/clients.enums";

export class FetchDtoData {

  @IsEnum(ClientName)
  @ApiModelProperty({ enum: Object.keys(ClientName) })
  readonly clientName: ClientName;

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