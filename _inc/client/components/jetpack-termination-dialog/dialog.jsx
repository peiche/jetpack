/**
 * External dependencies
 */
import { connect } from 'react-redux';
import { translate as __ } from 'i18n-calypso';
import Gridicon from 'components/gridicon';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

/**
 * Internal dependencies
 */
import { getSiteBenefits } from 'state/site';
import { getSiteRawUrl } from 'state/initial-state';
import Button from 'components/button';
import Card from 'components/card';
import JetpackTerminationDialogFeatures from 'components/jetpack-termination-dialog/features';
import QuerySite from 'components/data/query-site';
import QuerySiteBenefits from 'components/data/query-site-benefits';

function mapBenefitNameToGridicon( benefitName ) {
	switch ( benefitName ) {
		case 'contact-form':
			return 'align-image-center';
		case 'contact-form-feedback':
			return 'mail';
		case 'image-hosting':
			return 'image';
		case 'jetpack-backup':
			return 'cloud-download';
		case 'jetpack-stats':
			return 'stats-alt';
		case 'protect':
			return 'lock';
		case 'publicize':
			return 'share';
		case 'sharing':
			return 'share';
		case 'subscribers':
			return 'user';
		case 'video-hosting':
			return 'video-camera';
		default:
			return 'checkmark';
	}
}

function mapBenefitDataToViewData( benefit ) {
	return {
		title: benefit.title,
		description: benefit.description,
		amount: benefit.value,
		gridIcon: mapBenefitNameToGridicon( benefit.name ),
	};
}

/*
 * On Jetpack Termination
 *
 * This Dialog is designed to be used from multiple locations with different intents, either
 * disconnecting the Jetpack plugin or uninstalling it. To abstract this we use the word
 * "Termination" to represent both
 */

class JetpackTerminationDialog extends Component {
	static propTypes = {
		closeDialog: PropTypes.func.isRequired,
		disconnectJetpack: PropTypes.func.isRequired,
		location: PropTypes.oneOf( [ 'plugins', 'dashboard' ] ).isRequired,
		purpose: PropTypes.oneOf( [ 'disconnect', 'uninstall' ] ).isRequired,
		siteBenefits: PropTypes.object,
	};

	static defaultProps = {
		siteBenefits: [],
	};

	handleJetpackTermination() {
		this.props.terminateJetpack();
	}

	renderFeatures() {
		const { siteBenefits, siteName } = this.props;

		return (
			<JetpackTerminationDialogFeatures
				siteBenefits={ siteBenefits.map( mapBenefitDataToViewData ) }
				siteName={ siteName }
			/>
		);
	}

	render() {
		const { closeDialog, purpose, location } = this.props;

		const showModalClose = location === 'dashboard';

		return (
			<div className="jetpack-termination-dialog">
				<QuerySite />
				<QuerySiteBenefits />
				<Card>
					<div className="jetpack-termination-dialog__header">
						<h1>{ __( 'Disable Jetpack' ) }</h1>
						{ showModalClose && (
							<Gridicon
								icon="cross"
								className="jetpack-termination-dialog__close-icon"
								onClick={ closeDialog }
							/>
						) }
					</div>
				</Card>
				{ this.renderFeatures() }
				<Card>
					<div className="jetpack-termination-dialog__button-row">
						<p>
							{ purpose === 'disconnect'
								? __( 'Are you sure you want to log out?' )
								: __( 'Are you sure you want to log out (and deactivate)?' ) }
						</p>
						<div className="jetpack-termination-dialog__button-row-buttons">
							<Button onClick={ closeDialog }>{ __( 'Close' ) }</Button>
							<Button scary primary onClick={ this.handleJetpackTermination }>
								{ purpose === 'disconnect' ? __( 'Disconnect' ) : __( 'Deactivate' ) }
							</Button>
						</div>
					</div>
				</Card>
			</div>
		);
	}
}

export default connect( state => ( {
	siteName: getSiteRawUrl( state ).replace( /:: /g, '/' ),
	siteBenefits: getSiteBenefits( state ),
} ) )( JetpackTerminationDialog );
