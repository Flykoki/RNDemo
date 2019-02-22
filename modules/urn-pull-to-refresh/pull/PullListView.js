'use strict';

import React from 'react';
import {ListView} from 'react-native';
import Pullable from '../local/Pullable';

export default class PullListView extends Pullable {

    getScrollable = () => {
        return (
            <ListView
                ref={(c) => this.scroll = c}
                {...this.props}/>
        );
    }
}
