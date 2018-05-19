import xs, { Stream, Listener } from 'xstream'
import dropRepeats from 'xstream/extra/dropRepeats'
import { Selector } from './baseTypes'

export const observe = store => {
    const storeObservable = xs.from(store)

    return <T>(actionOrSelector: string | Selector<T>): Stream<T> => {
        if (typeof actionOrSelector === 'string') {
            let unsubscribe

            return xs.create({
                start(listener: Partial<Listener<T>>) {
                    unsubscribe = store.addActionListener(
                        listener.next.bind(listener)
                    )
                },

                stop() {
                    unsubscribe()
                }
            })
        }

        if (typeof actionOrSelector === 'function') {
            return storeObservable.map(actionOrSelector).compose(dropRepeats())
        }
    }
}