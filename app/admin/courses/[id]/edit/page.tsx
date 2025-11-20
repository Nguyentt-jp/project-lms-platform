import { adminGetCourse } from "@/app/data/admin/admin-get-course";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EditCourseForm from "@/app/admin/courses/[id]/edit/_components/edit-course-form";
import CourseConstructure from "@/app/admin/courses/[id]/edit/_components/course-constructure";

type Params = Promise<{id: string}>;

export default async function EditCoursePage({ params }: { params: Params}) {

    const {id} = await params;

    const data = await adminGetCourse(id);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">
                Edit Course:
                <span className="text-primary underline ml-4">{data.title}</span>
            </h1>
            <Tabs defaultValue="basic-info" className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="basic-info">Basic info</TabsTrigger>
                    <TabsTrigger value="course-structure">Course Structure</TabsTrigger>
                </TabsList>
                <TabsContent value="basic-info" >
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Info</CardTitle>
                            <CardDescription>
                                Provide basic information about the course.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <EditCourseForm data={data}/>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="course-structure" >
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Structure</CardTitle>
                            <CardDescription>
                                Here you can update your Course Structure.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CourseConstructure data={data}/>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}