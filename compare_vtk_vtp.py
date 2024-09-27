import vtk

# Define file paths
vtk_file_path = "public/data/ert/vtk_files/TESTBED_REORDERED20220201_1901_post.vtk"
vtp_file_path = "public/data/ert/vtp_files/TESTBED_REORDERED20220201_1901_post.vtp"

# Initialize readers for vtk and vtp files
vtk_reader = vtk.vtkUnstructuredGridReader()
vtk_reader.SetFileName(vtk_file_path)
vtk_reader.Update()

vtp_reader = vtk.vtkXMLPolyDataReader()
vtp_reader.SetFileName(vtp_file_path)
vtp_reader.Update()

# Extract data from the readers
vtk_data = vtk_reader.GetOutput()
vtp_data = vtp_reader.GetOutput()

# Gather key information from both datasets
vtk_points = vtk_data.GetNumberOfPoints()
vtk_cells = vtk_data.GetNumberOfCells()
vtk_point_data = vtk_data.GetPointData().GetNumberOfArrays()
vtk_cell_data = vtk_data.GetCellData().GetNumberOfArrays()

vtp_points = vtp_data.GetNumberOfPoints()
vtp_cells = vtp_data.GetNumberOfCells()
vtp_point_data = vtp_data.GetPointData().GetNumberOfArrays()
vtp_cell_data = vtp_data.GetCellData().GetNumberOfArrays()

# Print comparison summary
print("Comparison Summary:")
print(f"VTK - Points: {vtk_points}, Cells: {vtk_cells}, Point Data Arrays: {vtk_point_data}, Cell Data Arrays: {vtk_cell_data}")
print(f"VTP - Points: {vtp_points}, Cells: {vtp_cells}, Point Data Arrays: {vtp_point_data}, Cell Data Arrays: {vtp_cell_data}")
