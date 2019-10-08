import React, {Fragment} from 'react'
import GlobalStyles from '../../GlobalStyles'
import TopNav from '../TopNav/TopNav'


class Documentation extends React.Component {

    render() {
        return (
            <Fragment>
                <TopNav/>
                <GlobalStyles/>
                <div className='wrapper'>
                    <div className='doc-wrapper'>
                        <h1> Documentation will be added Later. </h1>
                    </div>
                </div>
            </Fragment>
        )
    }
}


export default Documentation