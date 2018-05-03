//import liraries
import React, { PureComponent } from 'react';
import { Modal, } from 'react-native';

// create a component
class ModelParent extends PureComponent {

    constructor(props){
        super(props);
        this.state={
            modalVisible:false,
        }
    }
    showModal = () =>{
        this.setState({modalVisible:true});
    }
    hideModal = () =>{
        this.setState({modalVisible:false});
    }

    render() {
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {alert("Modal has been closed.")}}
                >
                {this.props.children}
            </Modal>
        );
    }
}

//make this component available to the app
export default ModelParent;
