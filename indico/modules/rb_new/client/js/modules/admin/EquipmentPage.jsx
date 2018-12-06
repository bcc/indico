/* This file is part of Indico.
 * Copyright (C) 2002 - 2018 European Organization for Nuclear Research (CERN).
 *
 * Indico is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 3 of the
 * License, or (at your option) any later version.
 *
 * Indico is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Indico; if not, see <http://www.gnu.org/licenses/>.
 */

import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Grid} from 'semantic-ui-react';
import * as adminActions from './actions';
import RoomFeatureList from './RoomFeatureList';
import EquipmentTypeList from './EquipmentTypeList';


class EquipmentPage extends React.PureComponent {
    static propTypes = {
        actions: PropTypes.exact({
            fetchEquipmentTypes: PropTypes.func.isRequired,
            fetchFeatures: PropTypes.func.isRequired,
        }).isRequired,
    };

    componentDidMount() {
        const {actions: {fetchEquipmentTypes, fetchFeatures}} = this.props;
        fetchEquipmentTypes();
        fetchFeatures();
    }

    render() {
        return (
            <Grid columns={2}>
                <Grid.Column width={8}>
                    <EquipmentTypeList />
                </Grid.Column>
                <Grid.Column>
                    <RoomFeatureList />
                </Grid.Column>
            </Grid>
        );
    }
}

export default connect(
    null,
    dispatch => ({
        actions: bindActionCreators({
            fetchEquipmentTypes: adminActions.fetchEquipmentTypes,
            fetchFeatures: adminActions.fetchFeatures,
        }, dispatch),
    })
)(EquipmentPage);