//import liraries
import React, { PureComponent } from 'react';
import { View,StyleSheet, } from 'react-native';
import { connect } from 'react-redux'; 

import {createAction} from '../../../../utils';
import {SCREEN_WIDTH,} from '../../../../config/globalsize';
import {DATA_PREVIEW,} from '../../../../config/globalconst';
import Alert from '../../../../components/DataPreview/Alert';  
import TopSelector from '../../../../components/DataPreview/TopSelector';
import GroupList from '../../../../components/DataPreview/GroupList';
import DataPreviewList from '../../../../components/DataPreview/DataPreviewList';
import ModalParent from '../../../../components/common/ModalParent';

/**
 * 数据一览
*/

const groupSelectorSelected=1,datePickerSelected=0;

@connect()
class DataPreview extends PureComponent {

    constructor(props){
        super(props);
        let myDate = new Date();
        let prefixDate = myDate.getFullYear()+'-'+(myDate.getMonth()+1)+'-'+myDate.getDate();
        this.state={
            modalType:0,
        };
    }
    
    /**
     * 显示站点分组选择dialog
    */
    _showGroupSelector = ()=>{
        this.setState({'modalType':groupSelectorSelected});
        this._modalParent.showModal();
    }
    _hideGroupSelector = ()=>{
        this._modalParent.hideModal();
    }
    /**
     * 分组选择
    */
    selectGroup = (item)=>{
        this.props.dispatch(createAction('datapreview/updateState')({groupSelected:item}));
        mTag = this._topSelector.wrappedInstance.getSelectOption();
        this.props.dispatch(createAction('datapreview/loadPointWithData')({}))
        this._modalParent.hideModal();
    }
    _showDatePicker = () =>{
        this.setState({'modalType':datePickerSelected});
        this._modalParent.showModal();
    }
    _hideDatePicker = () =>{
        this._modalParent.hideModal();
    }
    
    render() {
        return (
            <View style={styles.container} >
                {/* 时间显示，类型选择：实时、分钟、小时、日*/}
                <TopSelector  ref={ref => this._topSelector = ref} showDatePicker={this._showDatePicker}/>
                <DataPreviewList getTopSelector={()=>this._topSelector.wrappedInstance} 
                    showGroupSelector={this._showGroupSelector} />
                <ModalParent ref={ref=>this._modalParent=ref}>
                    {
                        this.state.modalType==groupSelectorSelected
                        ?<GroupList hideDialog={this._hideGroupSelector} itemClick={this.selectGroup} />
                        :this.state.modalType==datePickerSelected
                        ?<Alert 
                            mSetSearchType ={(searchType)=>{ this.props.dispatch(createAction('datapreview/updateState')({searchType}))}}
                            mGetParentView={()=>{return DATA_PREVIEW}}
                            mCancelcallback={()=>{this._hideDatePicker();}} 
                            mcallback={(index,date)=>{this._topSelector.wrappedInstance._changeMTag(index,date)}} />
                        :<Alert 
                            mSetSearchType ={(searchType)=>{ this.props.dispatch(createAction('datapreview/updateState')({searchType}))}}
                            
                            mGetParentView={()=>{return DATA_PREVIEW}}
                            mCancelcallback={()=>{this._hideDatePicker();}} 
                            mcallback={(index,date)=>{this._topSelector.wrappedInstance._changeMTag(index,date)}} />
                    }
                </ModalParent> 
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width:SCREEN_WIDTH,
        alignItems: 'center',
        backgroundColor: 'white',
    },
});

//make this component available to the app
export default DataPreview;
