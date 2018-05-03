import { TabNavigator,TabBarBottom } from 'react-navigation';
import DataPreview from './DataPreview'
import Map from './Map'

export default TabNavigator ({
    DataPreview:{screen:DataPreview},
    Map: { screen: Map },
},
{
  headerMode: 'none',
  tabBarComponent: 'none',
  tabBarPosition: 'bottom',
  swipeEnabled: false,
  animationEnabled: true,
  lazyLoad: false,
});  