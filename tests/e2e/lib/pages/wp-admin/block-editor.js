/**
 * Internal dependencies
 */
import Page from '../page';
/**
 * WordPress dependencies
 */
import { getAllBlocks, searchForBlock } from '@wordpress/e2e-test-utils';
import { waitAndClick, waitForSelector, scrollIntoView } from '../../page-helper';

export default class BlockEditorPage extends Page {
	constructor( page ) {
		const expectedSelector = '.block-editor';
		super( page, { expectedSelector } );
	}

	async insertBlock( blockName ) {
		await searchForBlock( blockName );
		const blockIconSelector = `.editor-inserter__menu button[aria-label*='${ blockName }']`;
		const jetpackPanelSelector = '.components-panel__body .jetpack-logo';
		await scrollIntoView( this.page, jetpackPanelSelector );
		await waitAndClick( this.page, blockIconSelector );
		const blockInfo = await this.getInsertedBlock();
		return blockInfo;
	}

	async getInsertedBlock() {
		const blocks = await getAllBlocks();
		return blocks[ blocks.length - 1 ];
	}

	async publishPost() {
		await waitAndClick( this.page, '.editor-post-publish-panel__toggle' );

		// Disable reason: Wait for the animation to complete, since otherwise the
		// click attempt may occur at the wrong point.
		// Also, for some reason post-publish bar wont show up it we click to fast :/
		await page.waitFor( 5000 );

		await waitAndClick( this.page, '.editor-post-publish-button' );
		return await waitForSelector( this.page, '.post-publish-panel__postpublish-buttons a' );
	}

	async viewPost() {
		await waitForSelector( this.page, '.post-publish-panel__postpublish-buttons a' );
		await waitAndClick( this.page, '.post-publish-panel__postpublish-buttons a' );
	}

	async focus() {
		await this.page.focus( this.expectedSelector );
		await waitAndClick( this.page, '.editor-post-title__input' );
	}
}
