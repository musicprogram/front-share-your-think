import React, {Component} from 'react';
import './App.css';

import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import ActionCable from 'actioncable'

class App extends Component {
  state = { body: '' }

  componentDidMount() {
    window.fetch('https://share-your-think-back.herokuapp.com/1').then(data => {
      data.json().then(res => {
        this.setState({ body: res.body })
      })
    })

    const cable = ActionCable.createConsumer('ws://share-your-think-back.herokuapp.com/cable')
    this.sub = cable.subscriptions.create('MessagesChannel', {
      received: this.handleReceiveNewText
    })
  }

  handleReceiveNewText = ({ body }) => {
    if (body !== this.state.body) {
      this.setState({ body })
    }
  }

  render() {
    return (
      <div className="container">
        <h1 className="title">
          ShareYourThink
        </h1>
        <CKEditor
          editor={ ClassicEditor }
          config={{
            toolbar: ['heading', '|', 'bold', 'italic', 'blockQuote', 'link', 'numberedList', 'bulletedList', 'insertTable',
              'tableColumn', 'tableRow', 'mergeTableCells', 'mediaEmbed', '|', 'undo', 'redo' ]
          }}
          data={this.state.body}
          onInit={ editor => {
            // You can store the "editor" and use when it is needed.
            //console.log( 'Editor is ready to use!', editor );
          } }
          onChange={ ( event, editor ) => {
            const data = editor.getData();
            // console.log( { event, editor, data } );
            this.setState({ body: data })
            this.sub.send({ body: data, id: 1 })
          } }
          onBlur={ ( event, editor ) => {
            // console.log( 'Blur.', editor );
          } }
          onFocus={ ( event, editor ) => {
            // console.log( 'Focus.', editor );
          } }
        />

      </div>

    )
  }
}

export default App;