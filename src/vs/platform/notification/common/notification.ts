/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import Severity from 'vs/base/common/severity';
import { createDecorator } from 'vs/platform/instantiation/common/instantiation';
import { IDisposable } from 'vs/base/common/lifecycle';
import { IMarkdownString } from 'vs/base/common/htmlContent';
import { IAction } from 'vs/base/common/actions';
import Event, { Emitter } from 'vs/base/common/event';

export import Severity = Severity;

export const INotificationService = createDecorator<INotificationService>('notificationService');

export interface INotification {
	severity: Severity;
	message: string | IMarkdownString | Error;
	source?: string;
	actions?: INotificationActions;
}

export interface INotificationActions {
	primary?: IAction[];
	secondary?: IAction[];
}

export interface INotificationProgress {
	infinite(): void;
	total(value: number): void;
	worked(value: number): void;
	done(): void;
}

export interface INotificationHandle extends IDisposable {
	readonly onDidHide: Event<void>;
	readonly progress: INotificationProgress;

	updateSeverity(severity: Severity): void;
	updateMessage(message: string | IMarkdownString | Error): void;
	updateActions(actions?: INotificationActions): void;
}

export interface INotificationService {

	_serviceBrand: any;

	notify(notification: INotification): INotificationHandle;

	info(message: string | IMarkdownString | Error): INotificationHandle;
	warn(message: string | IMarkdownString | Error): INotificationHandle;
	error(message: string | IMarkdownString | Error): INotificationHandle;
}

export class NoOpNotification implements INotificationHandle {
	readonly progress = new NoOpProgress();

	private _onDidHide: Emitter<void> = new Emitter();

	public get onDidHide(): Event<void> {
		return this._onDidHide.event;
	}

	updateSeverity(severity: Severity): void { }
	updateMessage(message: string | IMarkdownString | Error): void { }
	updateActions(actions?: INotificationActions): void { }

	dispose(): void {
		this._onDidHide.dispose();
	}
}

export class NoOpProgress implements INotificationProgress {
	infinite(): void { }
	done(): void { }
	total(value: number): void { }
	worked(value: number): void { }
}