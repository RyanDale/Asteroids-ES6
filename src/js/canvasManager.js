import _ from 'lodash';

export default function canvasManager(id='canvas') {
    return _.memoize((id) => document.getElementById(id))(id);
};
