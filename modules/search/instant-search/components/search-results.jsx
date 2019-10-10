/** @jsx h */

/**
 * External dependencies
 */
import { __, _n, sprintf } from '@wordpress/i18n';
import { h, Component } from 'preact';

/**
 * Internal dependencies
 */
import SearchResultMinimal from './search-result-minimal';
import ScrollButton from './scroll-button';
import { getRailcarIdPrefix } from '../lib/tracks';

class SearchResults extends Component {
	constructor( props ) {
		super( props );
		this.state = { railcarIdPrefix: getRailcarIdPrefix() };
	}
	renderResult = ( result, index ) => {
		switch ( this.props.resultFormat ) {
			case 'engagement':
			case 'product':
			case 'minimal':
			default:
				return (
					<SearchResultMinimal
						result={ result }
						index={ index }
						railcarId={ `${ this.state.railcarIdPrefix }-${ index }` }
						query={ this.props.query }
					/>
				);
		}
	};

	render() {
		const { query } = this.props;
		const { results = [], total = 0, corrected_query = false } = this.props.response;

		if ( query === '' ) {
			return <div className="jetpack-instant-search__search-results" />;
		}
		if ( total === 0 ) {
			return (
				<div className="jetpack-instant-search__search-results">
					<div>
						<h3>{ sprintf( __( 'No Results.', 'jetpack' ), query ) }</h3>
					</div>
				</div>
			);
		}
		const num = new Intl.NumberFormat().format( total );

		return (
			<div
				className={ `jetpack-instant-search__search-results ${
					this.state.isLoading === true ? ' jetpack-instant-search__is-loading' : ''
				}` }
			>
				<p className="jetpack-instant-search__search-results-real-query">
					{ corrected_query !== false
						? sprintf(
								_n( 'Showing %s result for "%s"', 'Showing %s results for "%s"', total ),
								num,
								corrected_query
						  )
						: sprintf( _n( '%s results for "%s"', '%s results for "%s"', total ), num, query ) }
				</p>
				{ corrected_query !== false && (
					<p className="jetpack-instant-search__search-results-unused-query">
						{ sprintf( __( 'No results for "%s"', 'jetpack' ), query ) }
					</p>
				) }
				{ results.map( this.renderResult ) }
				{ this.props.hasNextPage && (
					<ScrollButton
						enableLoadOnScroll
						isLoading={ this.props.isLoading }
						onLoadNextPage={ this.props.onLoadNextPage }
					/>
				) }
			</div>
		);
	}
}

export default SearchResults;
