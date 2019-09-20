/**
 * External dependencies
 */
import Button from 'components/button';
import Card from 'components/card';
import Gridicon from 'components/gridicon';
import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'i18n-calypso';

/**
 * Internal dependencies
 */

import SingleFeature from './single-feature';

/**
 * Style dependencies
 */
import './style.scss';

const JetpackDisconnectDialogFeatures = ( {
	onCloseButtonClick,
	onContinueButtonClick,
	showModalClose,
	siteAdminUrl,
	siteBenefits,
	siteName,
} ) => {
	siteBenefits = siteBenefits || [];

	return (
		<div className="jetpack-disconnect-dialog__features">
			<Card>
				<div className="jetpack-disconnect-dialog__header">
					<h1>{ __( 'Disable Jetpack' ) }</h1>
					{ showModalClose && (
						<Gridicon
							icon="cross"
							className="jetpack-disconnect-dialog__close-icon"
							onClick={ onCloseButtonClick }
						/>
					) }
				</div>
			</Card>
			<Card>
				<p className="jetpack-disconnect-dialog__info">
					{ siteBenefits.length > 0
						? __(
								'Jetpack is currently powering several features of %(siteName)s. Once you disable Jetpack, these features will no longer be available and your site may no longer function the same way. We’ve highlighted some of the features you rely on below.',
								{
									args: {
										siteName,
									},
								}
						  )
						: __(
								"You may have modified Jetpack settings. Once you disable Jetpack, any settings will be lost. Visit {{a}}Jetpack Settings{{/a}} to check if you aren't sure.",
								{
									components: {
										a: <a href={ siteAdminUrl + 'admin.php?page=jetpack#/settings' } />,
									},
								}
						  ) }
				</p>
				<div className="jetpack-disconnect-dialog__features-list">
					{ siteBenefits.map( ( { title, description, amount, gridIcon } ) => (
						<SingleFeature
							amount={ amount }
							description={ description }
							gridIcon={ gridIcon }
							title={ title }
						/>
					) ) }
				</div>

				<div className="jetpack-disconnect-dialog__get-help">
					<p>
						{ __( 'Have a question? We’d love to help!' ) }{' '}
						<a href="https://jetpack.com/contact-support/">
							{ __( 'Chat now with the Jetpack support team.' ) }
						</a>
					</p>
				</div>
			</Card>
			<Card>
				<div className="jetpack-disconnect-dialog__button-row">
					<p>{ __( 'Are you sure you want to log out (and deactivate)?' ) }</p>
					<div>
						<Button onClick={ onCloseButtonClick }>{ __( 'Close' ) }</Button>
						<Button primary onClick={ onContinueButtonClick }>
							{ __( 'Continue' ) }
						</Button>
					</div>
				</div>
			</Card>
		</div>
	);
};

JetpackDisconnectDialogFeatures.propTypes = {
	featureHighlights: PropTypes.array,
	siteName: PropTypes.string,
	siteAdminUrl: PropTypes.string,
};

export default JetpackDisconnectDialogFeatures;
