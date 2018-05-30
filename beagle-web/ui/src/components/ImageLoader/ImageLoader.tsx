import * as React from 'react';

export default class ImageLoader extends React.Component<any> {

  private image: any;

  state: any = {
    isLoading: true,
    isFailed: false,
  }

  componentDidMount() {
    this.fetchImage();
  }

  componentWillUnmount() {
    this.clearEvents();
  }

  fetchImage = () => {
    this.image = new Image();
    this.image.addEventListener('load', this.onLoad);
    this.image.addEventListener('error', this.onError);
    this.image.src = this.props.src;
  }

  onLoad = () => {
    this.setState({
      isLoading: false,
      isFailed: false,
    })
  }

  onError = () => {
    this.clearEvents();
    this.setState({
      isLoading: false,
      isFailed: true,
    })
  }

  clearEvents() {
    if (this.image) {
      this.image.removeEventListener('load', this.onLoad)
      this.image.removeEventListener('error', this.onError)
    }
  }

  render() {
    if (this.state.isLoading) {
      return <span>Loading ...</span>
    } else {
      return this.props.renderFetched(this.image)
    }
  }
}