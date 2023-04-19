import mitt from 'mitt';

type Event = {
	OPEN_THEME_DRAWER: void;
};

const mittBus = mitt<Event>();

export default mittBus;
