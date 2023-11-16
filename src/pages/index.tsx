import { memo } from "react";
import Head from "next/head";
import { TodoForm } from "components/todo-form";
import { TodoList } from "components/todo-list";
import { TodoListName } from "components/todolist-name";

const Home = memo(function Home() {
  return (
    <div className="grid mx-5 py-10 sm:py-20">
      <Head>
        <title>TodoList</title>
        <meta name="description" content="TodoList with nested items" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="grid w-full max-w-3xl justify-self-center gap-y-7">
        <TodoListName />
        <TodoForm parent="root" />
        <TodoList parent="root" />
      </div>
    </div>
  );
});

export default Home;
