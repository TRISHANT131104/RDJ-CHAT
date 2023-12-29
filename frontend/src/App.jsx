import { Component } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      messages: [],
      value: "",
      name: "",
      room: "default_room",
    };

    this.client = new W3CWebSocket('wss://127.0.0.1:8000/ws/chat/' + this.state.room + '/');
  }

  

  onButtonClicked = (e) => {
    this.client.send(JSON.stringify({
      type : "message",
      message: this.state.value,
      name: this.state.name
    }));
    this.setState({ value: ''})
    e.preventDefault();
  }

  componentDidMount() {
    this.client.onopen = () => {
      console.log("Websocket client connected");
    };
    this.client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      console.log('got reply!', dataFromServer.type);
      if(dataFromServer){
        this.setState((state)=> ({
          messages: [...state.messages,
          { msg: dataFromServer.message,name: dataFromServer.name}
          ]
        }))
      }
    }
  }

  render() {
    return (
      <>
        {this.state.isLoggedIn ? 
        
        <div  className="w-1/2 h-auto border shadow-md bg-white mx-auto my-10">
          <div  className="flex items-center justify-between border-b p-2 h-max">
            <div  className="flex items-center">
              <img  className="rounded-full w-10 h-10"
                src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />
              <div  className="pl-2">
                <div  className="font-semibold">
                  <a  className="hover:underline" href="#">{this.state.name}</a>
                </div>
                <div  className="text-xs text-gray-600">Online</div>
              </div>
            </div>
            <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2" onClick={ value => this.setState({ isLoggedIn: false})}>Exit</button>
          </div>

          <div  className="flex-1 px-4 py-4 overflow-y-auto border h-96">
            {this.state.messages.map(message => 
              <>
              {this.state.name == message.name ?
              
              <div className="flex items-start gap-2.5 justify-end">
                <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-l-xl rounded-b-xl">
                    <div className="flex items-center space-x-2 ltr:space-x-reverse">
                      <span className="text-sm font-semibold text-gray-900">{message.name}</span>
                    </div>
                    <p className="text-sm font-normal py-2.5 text-gray-900">{message.msg}</p>
                </div>
                <img className="w-8 h-8 rounded-full" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Jese image"/>
              </div>
              :
              <div className="flex items-start gap-2.5 justify-start">
                <img className="w-8 h-8 rounded-full" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Jese image"/>
                <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-r-xl rounded-b-xl">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span className="text-sm font-semibold text-gray-900">{message.name}</span>
                    </div>
                    <p className="text-sm font-normal py-2.5 text-gray-900">{message.msg}</p>
                </div>
              </div>
              }
              </>
              )}
          </div>

          <form onSubmit={this.onButtonClicked}>
              <label htmlFor="chat"  className="sr-only">Your message</label>
              <div  className="flex items-center px-3 py-2 rounded-lg bg-gray-50 justify-center">
                  <input id="chat" className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Your message..." required  value={this.state.value} onChange={ e => {this.setState({value:e.target.value}); this.value = this.state.value;}}/>
                      <button type="submit"  className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100">
                      <svg  className="w-5 h-5 rotate-90 rtl:-rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                          <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z"/>
                      </svg>
                      <span  className="sr-only">Send message</span>
                  </button>
              </div>
          </form>

        </div>
        
        : 

        <section className="bg-gray-50">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
              <a href="#" className="flex items-center mb-6 text-3xl font-bold text-blue-600">
                Chat Rooms 
              </a>
              <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
                  <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
                          Sign in to your room
                      </h1>
                      <form className="space-y-4 md:space-y-6" action="#" onSubmit={ value => this.setState({ isLoggedIn: true})}>
                          <div>
                              <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">Your username</label>
                              <input type="username" name="username" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" placeholder="name@company.com" required  value={this.state.name} onChange={ e => {this.setState({name:e.target.value}); this.value = this.state.name;}}/>
                          </div>
                          <div>
                              <label htmlFor="room" className="block mb-2 text-sm font-medium text-gray-900">room</label>
                              <input type="room" name="room" id="room" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" required  value={this.state.room} onChange={ e => {this.setState({room:e.target.value}); this.value = this.state.room;}}/>
                          </div>
                          <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" >Enter</button>
                      </form>
                  </div>
              </div>
          </div>
        </section>

        }
      </>
    );
  }
}

export default App;
