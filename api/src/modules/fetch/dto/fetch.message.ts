
export enum MessageStatus {
    OK, WARNING, ERROR
}

export class FetchMessage {

    static readonly FETCH_EXISTS_ERROR = new FetchMessage(MessageStatus.ERROR, "fetch.exists.error");
    static readonly FETCH_SELECTOR_NOT_FOUND_ERROR = new FetchMessage(MessageStatus.ERROR, "fetch.selectorNotFound.error");

    static readonly FETCH_EXPOSE_ERROR = new FetchMessage(MessageStatus.ERROR, "fetch.expose.error");

    private constructor(public readonly status: MessageStatus, public readonly messageKey: string) {}


}

