import {Controller, Post, Body} from '@nestjs/common';
import {AppLogger} from '../../app.logger';

@Controller('fetch')
export class BotController {
    private readonly _logger: AppLogger = new AppLogger(BotController.name);

    constructor() {
    }

    /*@Post('/explore')
    async fetchExplore(@Body() testDto: TestDto) {
        this._logger.log(JSON.stringify(testDto));
    }

    @Post()
    async fetch(@Body() testDto: TestDto) {
        this._logger.log(JSON.stringify(testDto));
    }*/
}