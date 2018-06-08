  //need attribute for uigrid, not just class, or doesn't work properly.
  //remember to make DIVs under grid, and then put cards in those -- otherwise won't work properly
  //in fact, it doesn't even work to nest cards directly -- always make a container div -- colors get screwed up otherwise
  //should try programmatically creating the UIkit elements with javascript API to get same affect That
  //we're getting here in the tradiional way.
  //label after uk-grid loses proper color/style, for some reason
  //I don't think nested cards are proper -- colors get messed up as in above
  //I think sections + uk-preserve-color + divs (e.g. container) inside is the correct way
  //uk-light in span surrounding an e.g. button has diff effect from directly applying to nested elem.
  //masonry:true was causing a div to not resize correctly until window resize
  //masonry:true makes scrolling on FF mobile (but not chrome) kind of jumpy -- probably because of the JS necessary
  //FF mobile adds broder to input range / slider, remove with border:none
  //watch out for noscript and other addons like adblock blocking requests...
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

var sentences = [
  "The quick brown fox jumped over the lazy dog",
  "It was a dark and stormy night ; the rain fell in torrents ...",
  "Imagination is more important than knowledge"]
var sentence = sentences[Math.floor(Math.random()*sentences.length)]

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      firstSearch: true,
      searchText: sentence,
      success: false,
      error: "",
      waiting: false,
      results: [],
      paramNov: 0.0,
      paramNum: 15,
    };
    this.gridRef = React.createRef()
    this.searchChange = this.searchChange.bind(this);
    this.searchSubmit = this.searchSubmit.bind(this);
    this.paramsChange = this.paramsChange.bind(this);
    this.wordSwapping = this.wordSwapping.bind(this);
    this.copySentence = this.copySentence.bind(this);
  }

  copySentence(e) {
    e.preventDefault()
    var sentence = ""
    for (var token in this.state.results) {
      sentence += this.state.results[token].word + " "
    }
    sentence = sentence.slice(0, -1)
    UIkit.notification({
      message: 'copied to searchbar',
      status: 'success',
      pos: 'bottom-right',
      timeout: 1000
    });
    this.setState({searchText: sentence})
  }

  wordSwapping(wordIdx, listIdx) {
    var newMainWord = this.state.results[wordIdx].list[listIdx]
    var prevMainWord = this.state.results[wordIdx].word
    this.setState( (state) => {
      state.results[wordIdx].word = newMainWord
      state.results[wordIdx].list[listIdx] = prevMainWord
      return state
    })
  }

  searchChange(e) {
    this.setState({searchText: e.target.value, success: false, error: "", firstSearch: false});
  }

  searchSubmit(e) {
    e.preventDefault()
    if (!this.state.waiting) {
      this.setState({waiting: true, success: false})
      fetch("http://192.168.2.113:8080/api/words?query="+this.state.searchText+"&num="+this.state.paramNum+"&nov="+this.state.paramNov)
        .then( response => {
          if (response.status != 200) {
            this.setState({success: false, error: "Server returned status " + response.status, waiting: false})
          }
          else {
            response.json().then(
              (result) => {
                this.setState({success: true, results: result, waiting: false, firstSearch: false})
              },
              (error) => {
                this.setState({success: false, error: error.message, waiting: false, firstSearch: false})
              })
          }
        })
    }
  }

  paramsChange(e) {
    this.setState({[e.target.id]: e.target.value})
  }

  componentDidUpdate() {
    //this is hack-y because we don't know which event we should update after
    setTimeout(() => {
      var component = UIkit.grid(this.gridRef.current);
      component.$emit()
    }, 50)
  }

  render () {
    return (
      <div className="uk-container uk-padding-remove">
      <div className="uk-container uk-margin-top uk-visible@m"></div>
      <div className="uk-grid uk-flex-center" uk-grid="true">
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
            <div className="uk-grid-small uk-text-center uk-flex-top uk-flex-wrap " ref={this.gridRef} uk-grid="masonry:true">
              <div className="uk-width-3-4@s">
                <SearchBar onChange={this.searchChange} onSubmit={this.searchSubmit} success={this.state.success} danger={!this.state.success && this.state.error != ""} disabled={this.state.waiting} placeholder={sentence} value={this.state.firstSearch ? "" : this.state.searchText} />
              </div>
              {(this.state.error != "") && (
              <div className="uk-width-3-4@s">
                <div className="uk-alert-danger" uk-alert="true">
                  <p>{this.state.error}</p>
                </div>
              </div>
              )}
              <div className="uk-width-1-4@s">
                <AdvancedBar onChange={this.paramsChange} paramNov={this.state.paramNov} paramNum={this.state.paramNum}/>
              </div>
              <div className="uk-width-3-4@s">
                <ResultsSection results={this.state.results} onMainClick={this.copySentence} onListClick={this.wordSwapping}/>
              </div>
              <div className="uk-width-1-4@s">
                  <div className="uk-card uk-card-small uk-card-secondary uk-card-body uk-width-1-1">Testing box # 2 Testing box # 2 Testing box # 2 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="uk-container uk-margin-bottom uk-visible@m"></div>
      </div>
    )
  }
}

class SearchBar extends React.Component{
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div className="uk-card">
        <h5 className="uk-text-left uk-text-bold">Enter a sentence</h5>
        <form onSubmit={this.props.onSubmit}>
        <div uk-grid="true">
          <div className="uk-width-expand">
          <input className={"uk-overflow-auto uk-box-shadow-small uk-input" + (this.props.success ? " uk-form-success" : "") + (this.props.danger ? " uk-form-danger" : "")}
          placeholder={this.props.placeholder} onChange={this.props.onChange} disabled={this.props.disabled} value={this.props.value} />
          </div>
          <div className="uk-width-auto uk-padding-remove">
          <button className="uk-button uk-height-1-1 uk-box-shadow-small uk-button-primary uk-button-small" disabled={this.props.disabled}>Go</button>
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
  }

  render() {
    return (
      <div className="uk-card">
        <h5 className="uk-text-left uk-text-bold">Advanced</h5>
        <div className="uk-section uk-width-1-1 uk-padding-remove">
          <div uk-grid="true" className="uk-grid-small uk-flex-center uk-flex">
            <div className="uk-width-1-1@s uk-width-1-2">
              <ParamCard id={"paramNov"} name={"NOVELTY"} onChange={this.props.onChange} value={this.props.paramNov} range={[0.0, 1.0, 0.2]} decPlace={1}/>
            </div>
            <div className="uk-width-1-1@s uk-width-1-2">
              <ParamCard id={"paramNum"} name={"RESULTS"} onChange={this.props.onChange} value={this.props.paramNum} range={[5, 30, 5]} decPlace={0} />
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
        <span className="uk-text-center" ><b>{props.name}</b>&nbsp;
          <span className="uk-label uk-label-success" style={{backgroundColor: "#32d296", color:"#fff", marginBottom: "3px"}}>{parseFloat(props.value).toFixed(props.decPlace)}</span>
        </span>
      </div>
      <input id={props.id} className="uk-range uk-width-auto" style={{border: "none"}} onChange={props.onChange} defaultValue={props.value} type="range" min={props.range[0]} max={props.range[1]} step={props.range[2]}></input>
    </form>
    </div>
  )
}

class ResultsSection extends React.Component{
  constructor(props) {
    super(props);
  }

  render () {
    return (
    <div className="uk-section uk-section-primary uk-padding-small uk-preserve-color">
      {this.props.results.length == 0 && (
        <div className="uk-card uk-card-default uk-card-body">
          <b>RESULTS</b>
        </div>
      )}
      <div className="uk-container">
      <div className="uk-grid uk-grid-small" uk-grid="true">
      {this.props.results.map((result, i) => { return (
        <div key={i} className="uk-width-1-1">
          <div className="uk-section uk-text-left uk-section-default uk-padding-remove uk-preserve-color" >
              <button className="uk-button uk-button-small uk-button-secondary uk-box-shadow-medium" onClick={this.props.onMainClick} style={{textTransform: "none"}}>
                <b>{result.word}</b>
              </button>
              {result.list.map((word, j) => { return (
                <span key={j} className="uk-light">
                <button className="uk-button uk-button-primary uk-button-small  uk-box-shadow-small " onClick={() => this.props.onListClick(i, j)} style={{textTransform:"none"}}>{word}</button>
                </span>
              )})}
          </div>
        </div>
      )})}
    </div>
    </div>
    </div>
    )
  }
}


ReactDOM.render(

  <App />,
  document.getElementById('root')
);
