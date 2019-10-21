import React  from 'react';
import connect from "react-redux/es/connect/connect";

import StatusOfContests from "./StatusOfContests/StatusOfContests";
import MyContests from "./MyContests/MyContests";
import MyEntries from "./MyEntries/MyEntries";

import PrivateComponent from "../../PrivateComponent/PrivateComponent";

import style from "./MyDashboard.sass";

import { size } from 'lodash'

import { ROLE } from "../../../constants";

function MyDashboard(props) {
    const { myContests } = props;


    return (
            <div className={style.container} >

                <PrivateComponent requireRole={[ROLE.BUYER]}>
                    <StatusOfContests count={size(myContests)}/>
                </PrivateComponent>

                <div className={style.myProfile}>

                    <PrivateComponent requireRole={[ROLE.BUYER]}>
                        <MyContests />
                    </PrivateComponent>

                    <PrivateComponent requireRole={[ROLE.CREATIVE]}>
                        <MyEntries />
                    </PrivateComponent>

                </div>
            </div>

    )
}

const mapStateToProps = (state) => ({
    myContests: state.dashboardContestsReducer.myContests
});
export default connect( mapStateToProps )(MyDashboard);

