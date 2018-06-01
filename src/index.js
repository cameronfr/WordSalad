  //need attribute for uigrid, not just class, or doesn't work properly.
  //remember to make DIVs under grid, and then put cards in those -- otherwise won't work properly
  //should try programmatically creating the UIkit elements with javascript API to get same affect That
  //we're getting here in the tradiional way.
  //label after uk-grid loses proper color/style, for some reason
import UIkit from 'uikit';
// import Icons from 'uikit/dist/js/uikit-icons';
import './theme.less'
import React from 'react';
import ReactDOM from 'react-dom';

// UIkit.use(Icons);

var SiteText = {
  mainDescriptionText: "Evolve your text blah blah ed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?",
  titleText: "Word Salad"
}

class App extends React.Component{
  constructor(props){
    super(props);
  }
  render () {
    return (
      <div className="uk-container uk-height-1-1 uk-padding-remove">
      <div className="uk-container uk-margin-top uk-visible@m"></div>
      <div className="uk-grid uk-flex-center uk-height-1-1" uk-grid="true">
        <div className="uk-width-1-1" style={{maxWidth:"960px"}}>
          <div className="uk-card uk-card-small uk-card-body uk-card-secondary uk-border-rounded" style={{marginBottom: "-5px"}}>
              <h1 >{SiteText.titleText}</h1>
          </div>
          <div className="uk-card uk-card-body uk-card-default">
            <div id="titleSection" className="uk-card" >
              <div className="uk-card uk-card-small uk-border-rounded">
              <p >{SiteText.mainDescriptionText}</p>
              </div>
            </div>
            <div className="uk-grid-small uk-text-center" uk-grid="masonry:true">
              <div className="uk-width-3-4@s">
                <SearchBar />
              </div>
              <div className="uk-width-1-4@s">
                  <AdvancedBar />
              </div>
              <div className="uk-width-3-4@s">
                <BopCard />
              </div>
              <div className="uk-width-1-4@s">
                  <div className="uk-card uk-card-small uk-card-secondary uk-border-rounded uk-card-body uk-width-1-1">Testing box # 2 Testing box # 2 Testing box # 2 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    )
  }

}

                {/*<AdvancedParams />*/}
                {/*<BasicDescription />*/}
                {/*<SubscribeCard />*/}

class SearchBar extends React.Component{
  constructor(props){
    super(props);
    this.state = {searchText: "", success: false};
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({searchText: e.target.value, success: false});
  }

  onSubmit(e) {
    e.preventDefault()
    this.setState({success: true});
    console.log(this.state.searchText);
  }

  render() {
    return (
      <div className="uk-card">
        <h5 className="uk-text-left uk-text-bold">Enter a sentence</h5>
        <form onSubmit={this.onSubmit}>
        <div uk-grid="true">
          <div className="uk-width-expand">
          <input className={"uk-overflow-auto uk-box-shadow-small uk-input " + (this.state.success ? "uk-form-success" : "")}
          placeholder={"The quick brown fox jumped over the lazy dog."} onChange={this.onChange} />
          </div>
          <div className="uk-width-auto uk-padding-remove">
          <button className="uk-button uk-height-1-1 uk-box-shadow-small uk-button-primary uk-button-small">Go</button>
          </div>
        </div>
        </form>
      </div>
    )
  }
}

class AdvancedBar extends React.Component{
  constructor(props){
    super(props);
    this.state = {NOVELTY: 0.2, RESULTS: 15}
    this.sliderChange = this.sliderChange.bind(this)
  }

  sliderChange(e){
    this.setState({[e.target.name]: e.target.value})
  }

  render() {
    return (
      <div className="uk-card">
        <h5 className="uk-text-left uk-text-bold">Advanced</h5>
        <div className="uk-card uk-card-small uk-card-primary  uk-width-1-1 uk-padding-small ">
          <div uk-grid="true" className="uk-grid-small uk-flex-center uk-flex">
            <div className="uk-width-1-1@s uk-width-1-2">
              <ParamCard name={"NOVELTY"} onChange={this.sliderChange} value={this.state.NOVELTY} range={[0.0, 1.0, 0.2]} decPlace={1}/>
            </div>
            <div className="uk-width-1-1@s uk-width-1-2">
              <ParamCard name={"RESULTS"} onChange={this.sliderChange} value={this.state.RESULTS} range={[5, 30, 5]} decPlace={0} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function ParamCard(props) {
  return (
    <div className="uk-card uk-card-default uk-card-body uk-border-rounded uk-box-shadow-small uk-width-1-1" style={{padding: "4px"}}>
    <form>
      <div>
        <span className="uk-text-center" ><b>{props.name}</b>&nbsp;<span className="uk-label uk-label-success" style={{backgroundColor: "#32d296", color:"#fff", marginBottom: "3px"}}>{parseFloat(props.value).toFixed(props.decPlace)}</span></span>
      </div>
      <input name={props.name} className="uk-range uk-width-auto" onChange={props.onChange} defaultValue={props.value} type="range" min={props.range[0]} max={props.range[1]} step={props.range[2]}></input>
    </form>
    </div>
  )
}

class BopCard extends React.Component{
  constructor(props) {
    super(props);
    this.state = {bops:0};
    this.onButtonPress = this.onButtonPress.bind(this);
  }

  onButtonPress (e){
    this.setState(prevState => ({bops:prevState.bops+1}));
  }

  render () {
    return (
    <div className="uk-card uk-card-default uk-card-body uk-card-primary">
      <h3 className="uk-card-title">Default</h3>
      <button onClick={this.onButtonPress} className="uk-button uk-button-default">Bop</button> <BadgeCount count={this.state.bops} />
      <p>Lorem ipsum <a href="#">dolor</a> sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    </div>
    )
  }
}

function BadgeCount(props) {
  return <span className="uk-badge">{props.count}</span>
}

ReactDOM.render(

  <App />,
  document.getElementById('root')
);
