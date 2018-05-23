import * as chalk from 'chalk';
import * as PrettyError from 'pretty-error'; // it's really handy to make your life easier
import {LoggerService} from '@nestjs/common';

export class AppLogger implements LoggerService {
    private readonly prettyError = new PrettyError();

    constructor(private context: string, transport?) {
        this.prettyError.skipNodeFiles();
        this.prettyError.skipPackage('express', '@nestjs/common', '@nestjs/core');
    }

    log(message: string): void {
        this.formatedLog('info', message);
    }

    error(message: string, trace?: any): void {
        this.formatedLog('error', message, trace);
    }

    warn(message: string): void {
        this.formatedLog('warn', message);
    }

    // this method just for printing a cool log in your terminal , using chalk
    private formatedLog(level: string, message: string, error?): void {
        let result = '';
        const color = chalk.default;
        const currentDate = new Date();
        const time = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

        switch (level) {
            case 'info':
                result = `[${color.blue('INFO')}] ${color.dim.yellow.bold.underline(time)} [${color.green(
                    this.context,
                )}] ${message}`;
                break;
            case 'error':
                result = `[${color.red('ERR')}] ${color.dim.yellow.bold.underline(time)} [${color.green(
                    this.context,
                )}] ${message}`;
                if (error != null || undefined)
                    result.concat(`\n${error}`);
                break;
            case 'warn':
                result = `[${color.yellow('WARN')}] ${color.dim.yellow.bold.underline(time)} [${color.green(
                    this.context,
                )}] ${message}`;
                break;
            default:
                break;
        }
        console.log(result);
    }
}