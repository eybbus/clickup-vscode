// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {ClickupProvider} from './clickupProvider';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

const EXTENTION_NAME = 'clickus';

export function activate(context: vscode.ExtensionContext) {

	const clickProvider = new ClickupProvider();
	vscode.window.registerTreeDataProvider(EXTENTION_NAME, clickProvider);
	vscode.commands.registerCommand(`${EXTENTION_NAME}.refreshEntry`, () =>
		clickProvider.refresh()
  );

	const validateInput = (text: string) => {
		if (!text.startsWith('pk_')) {
			return 'Clickup personal tokens key start with "pk_"';
		}
		return null;
	};


  const commandHandler = async () => {
		const apiKey = await vscode.window.showInputBox({ prompt: 'Paste your Personal token Key', validateInput});
		if (apiKey) {
			context.globalState.update('apiKey', apiKey);
			vscode.window.showInformationMessage(`API Key has been set`);
			console.log(process.env);
			clickProvider.init(apiKey);
		}
  };

  context.subscriptions.push(vscode.commands.registerCommand(`${EXTENTION_NAME}.setApiKey`, commandHandler));
}

// this method is called when your extension is deactivated
export function deactivate() {}
