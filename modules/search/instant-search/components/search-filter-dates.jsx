/** @jsx h */

/**
 * External dependencies
 */
import { h, Component } from 'preact';
import strip from 'strip';

export default class SearchFilterDates extends Component {
	render() {
		return (
			<div>
				<h4 className="jetpack-search-filters-widget__sub-heading">{ this.props.filter.name }</h4>
				<ul className="jetpack-search-filters-widget__filter-list">
					{ this.props.aggregation &&
						'buckets' in this.props.aggregation &&
						[
							...this.props.aggregation.buckets
								// TODO: Remove this filter; API should only be sending buckets with document counts.
								.filter( bucket => !! bucket && bucket.doc_count > 0 )
								.map( bucket => (
									<div>
										<input
											disabled
											id={ `jp-instant-search-filter-dates-${ bucket.key_as_string }` }
											name={ bucket.key_as_string }
											type="checkbox"
										/>
										<label htmlFor={ `jp-instant-search-filter-dates-${ bucket.key_as_string }` }>
											{ strip( bucket.key_as_string ) } ({ bucket.doc_count })
										</label>
									</div>
								) ),
						]
							// TODO: Remove this reverse & slice when API adds filter count support
							.reverse()
							.slice( 0, 5 ) }
				</ul>
			</div>
		);
	}
}
