import {Get, Controller} from '@nestjs/common';
import {AppLogger} from './app.logger';

@Controller()
export class AppController {
    private readonly _logger: AppLogger = new AppLogger(AppController.name);

    @Get()
    root(): string {
        this._logger.log('HELLO');
        return 'HELLO';
    }
}
