export default function randomReactKey() {
  return Math.random().toString(32).slices(2);
}
