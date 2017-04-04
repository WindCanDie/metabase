import React, { Component, PropTypes } from "react";

import GuiQueryEditor from "metabase/query_builder/components/GuiQueryEditor.jsx";

import { serializeCardForUrl } from "metabase/lib/card";

import cx from "classnames";

import * as Query from "metabase/lib/query/query";

export default class PartialQueryBuilder extends Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        tableMetadata: PropTypes.object.isRequired,
        updatePreviewSummary: PropTypes.func.isRequired,
        previewSummary: PropTypes.string
    };

    componentDidMount() {
        const { value, tableMetadata } = this.props;
        this.props.updatePreviewSummary({
            type: "query",
            database: tableMetadata.db_id,
            query: {
                ...value,
                source_table: tableMetadata.id
            }
        });
    }

    setDatasetQuery = (datasetQuery) => {
        this.props.onChange(datasetQuery.query);
        this.props.updatePreviewSummary(datasetQuery);
    }

    render() {
        let { features, value, tableMetadata, previewSummary } = this.props;

        let datasetQuery = {
            type: "query",
            database: tableMetadata.db_id,
            query: {
                ...value,
                source_table: tableMetadata.id
            }
        };

        let previewCard = {
            dataset_query: {
                ...datasetQuery,
                query: {
                    aggregation: ["rows"],
                    breakout: [],
                    filter: [],
                    ...datasetQuery.query
                }
            }
        };
        let previewUrl = "/q#" + serializeCardForUrl(previewCard);

        const onChange = (query) => {
            this.props.onChange(query);
            this.props.updatePreviewSummary({ ...datasetQuery, query });
        }

        return (
            <div className="py1">
                <GuiQueryEditor
                    features={features}
                    datasetQuery={datasetQuery}
                    tableMetadata={tableMetadata}
                    databases={tableMetadata && [tableMetadata.db]}
                    setDatasetQuery={this.setDatasetQuery}
                    isShowingDataReference={false}
                    setDatabaseFn={null}
                    setSourceTableFn={null}
                    addQueryFilter={(filter) => onChange(Query.addFilter(datasetQuery.query, filter))}
                    updateQueryFilter={(index, filter) => onChange(Query.updateFilter(datasetQuery.query, index, filter))}
                    removeQueryFilter={(index) => onChange(Query.removeFilter(datasetQuery.query, index))}
                    addQueryAggregation={(aggregation) => onChange(Query.addAggregation(datasetQuery.query, aggregation))}
                    updateQueryAggregation={(index, aggregation) => onChange(Query.updateAggregation(datasetQuery.query, index, aggregation))}
                    removeQueryAggregation={(index) => onChange(Query.removeAggregation(datasetQuery.query, index))}
                >
                    <div className="flex align-center mx2 my2">
                        <span className="text-bold px3">{previewSummary}</span>
                        <a data-metabase-event={"Data Model;Preview Click"} target={window.OSX ? null : "_blank"} className={cx("Button Button--primary")} href={previewUrl}>Preview</a>
                    </div>
                </GuiQueryEditor>
            </div>
        );
    }
}
