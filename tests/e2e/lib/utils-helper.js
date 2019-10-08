/**
 * External dependencies
 */
import { execSync, exec } from 'child_process';
import config from 'config';

/**
 * Executes a shell command and return it as a Promise.
 * @param {string} cmd  shell command
 * @return {Promise<string>} output
 */
export async function execShellCommand( cmd ) {
	return new Promise( resolve => {
		const cmdExec = exec( cmd, ( error, stdout, stderr ) => {
			if ( error ) {
				console.warn( error );
			}
			return resolve( stdout ? stdout : stderr );
		} );
		cmdExec.stdout.on( 'data', data => console.log( data ) );
	} );
}

export function execSyncShellCommand( cmd ) {
	return execSync( cmd ).toString();
}

export function getNgrokSiteUrl() {
	const cmd =
		'echo $(curl -s localhost:4040/api/tunnels/command_line | jq --raw-output .public_url)';
	return execSyncShellCommand( cmd );
}

export async function resetWordpressInstall() {
	await execShellCommand( './tests/e2e/bin/setup-e2e-travis.sh reset_wp' );
}

/**
 * Provisions Jetpack plan through Jetpack Start flow
 *
 * @param {string} plan One of free, personal, premium, or professional.
 * @param {string} user Local user name, id, or e-mail
 * @return {string} authentication URL
 */
export function provisionJetpackStartConnection( plan = 'professional', user = 'wordpress' ) {
	const [ clientID, clientSecret ] = config.get( 'jetpackStartSecrets' );
	const url = getNgrokSiteUrl();

	const cmd = `sh ./bin/partner-provision.sh --partner_id=${ clientID } --partner_secret=${ clientSecret } --user=${ user } --plan=${ plan } --url=${ url }`;

	const response = execSyncShellCommand( cmd );
	console.log( cmd, response );

	const json = JSON.parse( response );
	if ( json.success !== true ) {
		throw new Error( 'Jetpack Start provision is failed. Response: ' + response );
	}

	return json.next_url;
}
