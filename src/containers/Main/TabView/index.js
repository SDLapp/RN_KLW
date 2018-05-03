import { TabNavigator,TabBarBottom } from 'react-navigation';
import DataPreviewAll from './DataPreviewAll'
import Me from './Me'

export default TabNavigator({
  DataPreviewAll:{screen:DataPreviewAll},
  Me: { screen: Me },
},
{
  headerMode: 'none',
  tabBarComponent: TabBarBottom,
  tabBarPosition: 'bottom',
  swipeEnabled: false,
  animationEnabled: true,
  lazyLoad: false,
});  