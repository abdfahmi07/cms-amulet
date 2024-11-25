"use client";

import NewsList from "./news-list";

const EWSPage = () => {
  return (
    <div className=" space-y-5">
      {/* <Card>
        <CardHeader>
          <CardTitle>List Reporting</CardTitle>
        </CardHeader>
        <CardContent className="p-0"> */}
      <NewsList />
      {/* </CardContent>
      </Card> */}

      {/* <Card>
        <CardHeader>
          <CardTitle>Advanced Table</CardTitle>
        </CardHeader>
        <CardContent>
          <AdvancedTable />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Draggable Table</CardTitle>
        </CardHeader>
        <CardContent>
          <DraggableTable columns={columns} initialData={userData} />
        </CardContent>
      </Card> */}
    </div>
  );
};

export default EWSPage;
